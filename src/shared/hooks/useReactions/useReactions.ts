import { useEffect, useState } from 'react';

import { IPost, UserReaction, UserReactionStructure } from '@/entities/Post/model/types';
import { useAuth } from '@/features';
import {
  assignReactionStructureToPostHandler,
  removeReactionStructureFromPostHandler,
} from '@/shared/api/post';
import { getId } from '@/shared/utils';
import { logBackendError } from '@/shared/utils/error';

export const useReactions = (post: IPost) => {
  const [reactions, setReactions] = useState<UserReactionStructure[]>();
  const [prevPostReactions, setPrevPostReactions] = useState<UserReactionStructure[]>();

  const { executeQueryCallback } = useAuth();

  useEffect(() => {
    setReactions(post.reactions);
    setPrevPostReactions(post.prev_post?.reactions ?? []);
  }, [post]);

  const updateReactionCount = (
    reaction: UserReactionStructure,
    total_reactions: number,
    user_reaction: UserReaction | null,
  ) => {
    const updatedReaction = {
      ...reaction,
      total_reactions: total_reactions,
      user_reaction: user_reaction,
    };
    let updatedReactions: UserReactionStructure[] = [];
    if (reactions) {
      updatedReactions = reactions.map((r) => {
        if (getId(r) === getId(reaction)) {
          return updatedReaction;
        } else {
          return r;
        }
      });
    } else {
      updatedReactions = [updatedReaction];
    }

    setReactions(() => [...updatedReactions]);
  };

  const handleReactionClick = (reaction: UserReactionStructure) => {
    executeQueryCallback((accessToken: string) => {
      if (!reaction.user_reaction) {
        const requestBody = new FormData();
        requestBody.append('structure_reference', getId(reaction).toString());
        requestBody.append('description', reaction.name);
        requestBody.append(
          'user_reaction',
          JSON.stringify({ structure_reference: getId(reaction), description: reaction.name }),
        );
        assignReactionStructureToPostHandler(getId(post), requestBody, accessToken)
          .then((response) => {
            const updatedReaction: UserReactionStructure = response.filter(
              (r: UserReactionStructure) => getId(r) === getId(reaction),
            )?.[0];
            const userReaction = updatedReaction?.user_reaction ?? null;
            updateReactionCount(reaction, reaction.total_reactions + 1, userReaction);
          })
          .catch((error) => {
            logBackendError(error, 'Не удалось назначить реакцию');
          });
      } else {
        //remove reaction from post
        removeReactionStructureFromPostHandler(getId(post), getId(reaction), accessToken)
          .then(() => {
            updateReactionCount(reaction, reaction.total_reactions - 1, null);
          })
          .catch((error) => {
            logBackendError(error, 'Удаление реакции не удалось');
          });
      }
    });
  };

  return { reactions, setReactions, handleReactionClick, prevPostReactions, setPrevPostReactions };
};
